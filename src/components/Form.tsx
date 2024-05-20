import React, { useEffect, useState } from "react";
import { Button, Text, TextInput } from "react-native";

type AccountCode = Number[];

type Account = {
    id: string
    accounts?: Account[]
}

const Form = (): JSX.Element => {

    const [code, setCode] = useState("")
    const [suggestedCode, setSuggestedCode] = useState()

    const [accounts, setAccounts] = useState<Account[]>([])
    const [accountCode, setAccountCode] = useState<Number[]>([])

    const [touched, setTouched] = useState(false)
    const [error, setError] = useState("")

    // CHANGE EACH INDIVIDUAL TEST TO A LEGIBLE FUNCION (parentIsValid, successorIsValid)
    const inputIsValid = (accountCode: number[]) =>
        accountCode.reduce<boolean>((prevValue, accountCodePart) =>
            Boolean(prevValue &&
                !Number.isNaN(Number(accountCodePart)) &&
                Number(accountCodePart) > 0
                && Number(accountCodePart) <= 999), true)



    useEffect(() => {
        const accountCode = code.split(".").map(Number)
        setTouched(true)

        if (!inputIsValid(accountCode) && touched) {
            setError("Invalid input")
            return
        }

        setError("")

        setAccountCode(accountCode)
    }, [code])


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
                <Button title="Add" onPress={() => {}} />
            </>
            <>
                <Text style={{ color: "red" }}>{error}</Text>
            </>
            <>{accounts.map(mapAccount)}</>
        </>
    )



}

export default Form;
