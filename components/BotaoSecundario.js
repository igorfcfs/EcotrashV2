import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors } from '../styles';

export default function PrimaryButton({ text, onPress }) {
    return (
        <TouchableOpacity style={styles.botaoSecundario} onPress={onPress}>
            <Text style={styles.botaoSecundarioTexto}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    botaoSecundario: {
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primario,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    botaoSecundarioTexto: {
        color: colors.primario,
        fontSize: 16,
    },
})
