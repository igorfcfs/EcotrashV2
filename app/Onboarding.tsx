import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";
import { StackNavProp } from "@/types/navigation";

type OnboardingNavigationProp = StackNavProp<'Onboarding'>;
const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("../assets/onboarding-1.png"),
    title: "Descarte eletrônico de forma simples e consciente.",
    description:
      "\n\nCom o EcoTech, você encontra pontos de coleta e contribui para um planeta mais limpo — tudo pelo seu celular.",
  },
  {
    id: "2",
    image: require("../assets/onboarding-2.png"),
    title: "Tecnologia que recompensa",
    description:
      "Ganhe Ecoins a cada descarte.\n\nA leitura inteligente identifica o tipo do material e envia tudo para o app — acumule pontos e recompensas.\n\nVocê acompanha seu impacto e acumula pontos sustentáveis.",
  },
  {
    id: "3",
    image: require("../assets/onboarding-3.png"),
    title: "Transforme ações em impacto real",
    description:
      "Seja parte da mudança.\n\nCada item reciclado ajuda a reduzir o lixo eletrônico e incentiva novas práticas sustentáveis.\n\nJunte-se à EcoTech e faça a diferença!",
  },
];

export default function Onboarding() {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const { colors } = useTheme();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem("@hasSeenOnboarding", "true");
      navigation.replace("Login");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const onMomentumScrollEnd = (e) => {
    const idx = Math.floor(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(idx);
  };

  const renderSlide = ({ item }) => {
    const CARD_HEIGHT = height * 0.55; 
    const OVERLAP_AMOUNT = 50; 

    return (
      <View style={styles.fullScreenSlide}>
        {/* 🖼️ Imagem (Positioned Absolute) */}
        <Image
          source={item.image}
          // A imagem se estende para baixo para ser sobreposta pelo card
          style={[styles.image, { height: height - CARD_HEIGHT + OVERLAP_AMOUNT }]} 
          resizeMode="cover"
        />

        {/* 💳 Contêiner do Card Flutuante */}
        <View
          style={[
            styles.cardContainer,
            {
              height: CARD_HEIGHT,
              backgroundColor: colors.backgroundSecundario,
              // Move o card para cima para sobrepor a imagem
              transform: [{ translateY: -OVERLAP_AMOUNT }], 
              // 💡 Adiciona uma margem inferior para compensar o movimento do translateY
              marginBottom: -OVERLAP_AMOUNT,
              shadowColor: colors.inverso === '#fff' ? '#000' : '#FFF',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 8,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.titulo }]}>
            {item.title}
          </Text>
          <Text style={[styles.description, { color: colors.inverso }]}>
            {item.description}
          </Text>

          {/* 🔘 Botões inferiores (dentro do card) */}
          <View style={styles.buttonsContainer}>
            
            {/* 1. Botão PRÓXIMO/COMEÇAR (Aparece em cima) */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                {
                  backgroundColor: colors.buttonOnboarding,
                },
              ]}
              onPress={handleNext}
            >
              <Text style={[styles.buttonText, { color: colors.neutro, fontWeight: '900' }]}>
                {currentIndex === slides.length - 1 ? "COMEÇAR" : "PRÓXIMO"}
              </Text>
            </TouchableOpacity>
            
            {/* 2. Botão VOLTAR (Aparece em baixo, se não for o primeiro slide) */}
            {currentIndex > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={handlePrev}
              >
                <Text style={[styles.buttonText, { color: colors.titulo, fontWeight: '900' }]}>
                  VOLTAR
                </Text>
              </TouchableOpacity>
            )}
            
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fullScreenSlide: {
    width,
    flex: 1,
    justifyContent: "flex-end",
  },

  image: {
    width: "100%",
    position: 'absolute',
    top: 0,
    resizeMode: "cover", 
  },
  
  cardContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // Note: 'transform' e 'marginBottom' são definidos dinamicamente no renderSlide
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "left",
    marginBottom: 40,
    // Garantindo que a cor do texto principal use 'colors.texto'
  },

  buttonsContainer: {
    flexDirection: "column", 
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  },
  
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  
  backButton: {
    backgroundColor: 'transparent',
    // Espaço para separar do botão de cima (agora o Voltar está embaixo)
    marginTop: 10, 
  },

  primaryButton: {
    // Não precisa de margem inferior, pois o botão VOLTAR é que terá o espaçamento.
  },
  
  buttonText: {
    fontSize: 14,
    fontWeight: '900',
  },
});