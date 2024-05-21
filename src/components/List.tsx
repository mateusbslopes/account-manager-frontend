import React from 'react'
import { Account, colors, styles } from '../../App'
import { Button, Text, View } from 'react-native'

type ListProps = {
    accounts: Account[]
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>
}

const List = ({ accounts, navigation }: ListProps) => {

    const mapAccount = (acc: Account): any => {
        return acc ? [
            <Text key={acc.id}>{acc.id.split(".").map(m => Number(m) + 1).join(".")}</Text>,
            acc.accounts?.length ? acc.accounts?.map(mapAccount) : null
        ] : null
    }

    return (
        <View style={styles.container}>
            <View style={{ margin: colors.spacingStep * 3 }}>
                <Button title="Criar Conta" onPress={() => { navigation.navigate("Conta") }} />
            </View>
            <View style={styles.card}>
                <Text>Listagem</Text>
                {accounts.map(mapAccount)}
            </View>
        </View>
    )
}

export default List