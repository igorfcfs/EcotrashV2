import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BotaoPrimario from '../components/BotaoPrimario';

export default function TermosDeUso() {
  const navigation = useNavigation();

  const abrirPoliticaPrivacidade = () => {
    Linking.openURL(
      'https://docs.google.com/document/d/1bepwCWLdwptNczsenpEA07vRHdVY6j4uO2oWQXK6Lw0/edit?usp=sharing'
    );
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Text style={styles.header}>TERMOS DE USO DE SOFTWARE</Text>
      <Text style={styles.data}>Última Atualização: 25/09/2025</Text>

      {/* Conteúdo rolável */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
        <Text style={styles.text}>
          Ao baixar, instalar, acessar ou usar o software EcoTech, você concorda em cumprir e
          estar legalmente vinculado aos seguintes Termos de Uso. Se você não concorda com estes
          termos, não deve utilizar o software.
        </Text>

        <Text style={styles.sectionTitle}>2. Licença de Uso</Text>
        <Text style={styles.text}>
          2.1 <Text style={styles.bold}>Concessão de Licença:</Text> Sujeito ao cumprimento destes
          Termos de Uso, a EcoTech concede a você uma licença limitada, não exclusiva,
          intransferível e revogável para usar o software EcoTech apenas para fins pessoais e não
          comerciais.
        </Text>
        <Text style={styles.text}>
          2.2 <Text style={styles.bold}>Restrições de Uso:</Text> Você concorda em não (a) copiar,
          modificar ou criar obras derivadas do software; (b) realizar engenharia reversa,
          descompilar ou tentar extrair o código-fonte do software; (c) alugar, arrendar,
          sublicenciar ou distribuir o software para terceiros.
        </Text>

        <Text style={styles.sectionTitle}>3. Atualizações</Text>
        <Text style={styles.text}>
          A EcoTech pode fornecer atualizações, correções de bugs ou outras modificações do software
          periodicamente. Essas atualizações podem ser instaladas automaticamente, e você concorda
          em recebê-las como parte do seu uso contínuo do software.
        </Text>

        <Text style={styles.sectionTitle}>4. Propriedade Intelectual</Text>
        <Text style={styles.text}>
          Todos os direitos, títulos e interesses relacionados ao software, incluindo, sem
          limitação, todos os direitos autorais, patentes, segredos comerciais, marcas registradas e
          outros direitos de propriedade intelectual são de propriedade exclusiva da EcoTech. Estes
          Termos de Uso não concedem a você qualquer direito de propriedade intelectual sobre o
          software.
        </Text>

        <Text style={styles.sectionTitle}>5. Coleta de Dados e Privacidade</Text>
        <Text style={styles.text}>
          5.1 <Text style={styles.bold}>Coleta de Dados:</Text> A EcoTech pode coletar informações
          sobre o uso do software, incluindo dados técnicos e informações relacionadas ao
          desempenho, para melhorar a funcionalidade do software.
        </Text>
        <Text style={styles.text}>
          5.2 <Text style={styles.bold}>Política de Privacidade:</Text> O uso do software está
          sujeito à Política de Privacidade da EcoTech, que pode ser acessada em{' '}
          <Text style={styles.link} onPress={abrirPoliticaPrivacidade}>
            https://docs.google.com/document/d/1bepwCWLdwptNczsenpEA07vRHdVY6j4uO2oWQXK6Lw0
          </Text>
        </Text>

        <Text style={styles.sectionTitle}>6. Limitação de Responsabilidade</Text>
        <Text style={styles.text}>
          Em nenhuma circunstância a EcoTech será responsável por quaisquer danos diretos,
          indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso ou da
          incapacidade de usar o software, mesmo que a EcoTech tenha sido avisada da possibilidade de
          tais danos.
        </Text>

        <Text style={styles.sectionTitle}>7. Garantia Limitada</Text>
        <Text style={styles.text}>
          O software é fornecido "como está", sem garantias de qualquer tipo, expressas ou implícitas,
          incluindo, mas não se limitando a, garantias de comercialização, adequação a um propósito
          específico ou não violação.
        </Text>

        <Text style={styles.sectionTitle}>8. Rescisão</Text>
        <Text style={styles.text}>
          Estes Termos de Uso são efetivos até serem rescindidos. A EcoTech pode rescindir estes
          Termos de Uso a qualquer momento, sem aviso prévio, se você violar qualquer uma das
          disposições aqui contidas. Após a rescisão, você deve cessar todo o uso do software e
          destruir todas as cópias em sua posse.
        </Text>

        <Text style={styles.sectionTitle}>9. Disposições Gerais</Text>
        <Text style={styles.text}>
          9.1 <Text style={styles.bold}>Legislação Aplicável:</Text> Estes Termos serão regidos e
          interpretados de acordo com as leis do estado de São Paulo, sem consideração aos conflitos
          de leis.
        </Text>
        <Text style={styles.text}>
          9.2 <Text style={styles.bold}>Alterações aos Termos:</Text> A EcoTech reserva-se o direito
          de modificar estes Termos de Uso a qualquer momento. As modificações serão efetivas quando
          publicadas no site da EcoTech ou notificadas a você por qualquer outro meio.
        </Text>
        <Text style={styles.text}>
          9.3 <Text style={styles.bold}>Acordo Integral:</Text> Estes Termos de Uso constituem o
          acordo integral entre você e a EcoTech em relação ao uso do software e substituem todos os
          entendimentos ou acordos anteriores, escritos ou orais.
        </Text>

        <Text style={styles.sectionTitle}>10. Contato</Text>
        <Text style={styles.text}>
          Se você tiver dúvidas sobre estes Termos de Uso, entre em contato com a EcoTech em{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('mailto:dsecotech@gmail.com')}
          >
            dsecotech@gmail.com
          </Text>
        </Text>

        <Text style={styles.footer}>© {new Date().getFullYear()} EcoTech. Todos os direitos reservados.</Text>
      </ScrollView>

      {/* Botão de voltar */}
      <BotaoPrimario text="Voltar" onPress={() => navigation.goBack()} style={{alignSelf: 'center'}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  data: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 15,
  },
  scroll: {
    flex: 1,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 5,
    color: '#222',
  },
  text: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '600',
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#777',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
