import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors } from '../styles/index';

export default function PrimaryButton({ text, onPress, style }) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={[styles.buttonText, style]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        backgroundColor: colors.primario,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center', // <- isso garante a centralização vertical
    },

    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center', // <- útil no Android
        includeFontPadding: false, // <- remove espaço extra vertical no Android
        alignSelf: 'center',
        justifyContent: 'center'
    },

})
