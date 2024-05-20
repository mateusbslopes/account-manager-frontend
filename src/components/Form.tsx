import React, { useEffect, useState } from "react";
import { Button, Text, TextInput } from "react-native";

type AccountCode = {
    parent: number;
    child: number;
    grandchild: number;
}

type Account = {
    id: string
    accounts?: Account[]
}

const Form = (): JSX.Element => {

    const [code, setCode] = useState("")
    const [suggestedCode, setSuggestedCode] = useState()

    const [accounts, setAccounts] = useState<Account[]>([])
    const [accountCode, setAccountCode] = useState<AccountCode>({
        parent: 0,
        child: 0,
        grandchild: 0
    })

    const [touched, setTouched] = useState(false)
    const [error, setError] = useState("")

    // CHANGE EACH INDIVIDUAL TEST TO A LEGIBLE FUNCION (parentIsValid, successorIsValid)
    const inputIsValid = (parent: string, child: string, grandchild: string, rest: string): boolean =>
        Boolean(
            (parent && !Number.isNaN(Number(parent)) && Number(parent) > 0 && Number(parent) <= 999) &&
            (child == undefined || (child != "" && !Number.isNaN(Number(child)) && Number(child) > 0 && Number(child) <= 999)) &&
            (grandchild == undefined || (grandchild != "" && !Number.isNaN(Number(grandchild)) && Number(grandchild) > 0 && Number(child) <= 999)) &&
            (rest == undefined && rest != "")
        )

    useEffect(() => {
        const [parent, child, grandchild, rest] = code.split(".")
        setTouched(true)
        if (!inputIsValid(parent, child, grandchild, rest) && touched) {
            setError("Invalid input")
            return
        }

        setError("")

        setAccountCode({
            parent: Number(parent),
            child: Number(child),
            grandchild: Number(grandchild)
        })
    }, [code])

    const addAccount = () => {
        const realAccountCode = {
            parent: --accountCode.parent,
            child: --accountCode.child,
            grandchild: --accountCode.grandchild
        }

        accounts[realAccountCode.parent] = {
            id: `${realAccountCode.parent}`
        }

        console.log(accounts)

        setAccounts([...accounts])
    }

    const mapAccount = (acc: Account): any => (
        acc && [
            <Text key={acc.id}>{Number(acc.id) + 1}</Text>,
            acc.accounts?.map(mapAccount)
        ])


    return (
        <>
            <>
                <Text>Conta</Text>
                <TextInput onChangeText={setCode} style={{ borderColor: 'black', borderWidth: 3 }} />
                <Button title="Add" onPress={addAccount} />
            </>
            <>
                <Text style={{ color: "red" }}>{error}</Text>
            </>
            <>{accounts.map(mapAccount)}</>
        </>
    )



}

export default Form;
