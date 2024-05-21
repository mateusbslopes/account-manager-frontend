import React from 'react'
import { Account, colors, styles } from '../../App'
import { Button, FlatList, Text, View } from 'react-native'

type ListProps = {
    accounts: Account[]
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>
}

const List = ({ accounts }: ListProps) => {

    const mapAccount = (acc: Account): any => {
        return acc ? [
            <Text key={acc.id}>{acc.id.split(".").map(m => Number(m) + 1).join(".")}</Text>,
            acc.accounts?.length ? acc.accounts?.map(mapAccount) : null
        ] : null
    }

    const formatId = (id: string): string => id.split(".").map(m => Number(m) + 1).join(".")

    const renderAccounts = (item: Account): JSX.Element => (
        item && <View key={item.id}>
            <View style={styles.item}>
                <Text>{formatId(item.id)} - {item.name}</Text>
            </View>
            {item.accounts.map(renderAccounts)}
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text>Listagem</Text>
                <FlatList
                    data={accounts}
                    renderItem={({ item }) => renderAccounts(item)}
                />
            </View>
        </View>
    )
}

export default List