import React from 'react'
import { Account } from '../../App'
import { Button, Text } from 'react-native'

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
        <>
            <Button title="Criar Conta" onPress={() => {navigation.navigate("Conta")}}/>
            {accounts.map(mapAccount)}
        </>
    )
}

export default List