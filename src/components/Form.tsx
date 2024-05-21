import React, { useEffect, useState } from "react";
import { Button, Text, TextInput } from "react-native";
import { AccountAlreadyExistsError, ParentDoesntExistsError } from "../error";

type Account = {
    id: string
    accounts: Account[]
}

const Form = (): JSX.Element => {

    const [code, setCode] = useState("")
    const [suggestedCode, setSuggestedCode] = useState("")

    const [accounts, setAccounts] = useState<Account[]>([])
    const [accountCode, setAccountCode] = useState<number[]>([])

    const [touched, setTouched] = useState(false)
    const [error, setError] = useState("")

    const inputIsValid = (accountCode: number[]) =>
        accountCode.reduce<boolean>((prevValue, accountCodePart) =>
            Boolean(prevValue &&
                !Number.isNaN(Number(accountCodePart)) &&
                Number(accountCodePart) > 0
                && Number(accountCodePart) <= 999), true)



    useEffect(() => {
        let accountCode = code.split(".").map(Number)
        setTouched(true)
        setError("")

        if (!inputIsValid(accountCode) && touched) {
            setError("Invalid input")
            return
        }

        accountCode = accountCode.map(code => code - 1)
        setAccountCode(accountCode)
        console.log("accountCode", accountCode)
        console.log("accounts", accounts)
        
        updateSuggestedCode()
    }, [code])

    /* Manage stack (view is inverted)
        Pop and add 1   Pop and add 1
    0   |0              |0
    3   |3              |3
    5   |5              |6
    999 |1000           |
    999 
    */
    // When suggesting a code if the cliend presses 1.1 and the next available is 2.4 
    // but 2 has another type suggest the next one?
    const getSuggestedCode = (accounts: Account[], currDepth: number = 0, suggestedCodes: number[] = []): number[] => {
        if (!accounts.length) return suggestedCodes;
        suggestedCodes.push(accountCode[currDepth])

        const childrenAccounts = accounts[accountCode[currDepth]]?.accounts
        if (childrenAccounts?.length) {
            suggestedCodes = getSuggestedCode(accounts[accountCode[currDepth]].accounts, currDepth + 1, suggestedCodes)
        } 
        return suggestedCodes
    }

    const updateSuggestedCode = () => {
        setSuggestedCode("")
        let suggestedCode = getSuggestedCode(accounts).map(code => code + 1).join(".")
        console.log(suggestedCode)
        setSuggestedCode(suggestedCode)
    }

    // Opposed to codeIsValid (see the pattern chage) this throws an error to be handled instead of a boolean since 
    // its responsible to test and identify the specifity of the error and not only if its valid or not. 
    const validateAccount = () => {
        const accountCodeDepth = accountCode.length

        // TODO merge both for loops
        for (let i = 1, currAccounts: Account[] = accounts; i < accountCodeDepth - 1; i++) {
            if (!currAccounts || (currAccounts && !currAccounts[accountCode[i]])) throw new ParentDoesntExistsError();
            currAccounts = currAccounts[accountCode[i]].accounts
        }
        for (let i = 0, currAccounts: Account[] = accounts; i < accountCodeDepth; i++) {
            if (i + 1 == accountCodeDepth)
                if (currAccounts[accountCode[i]])
                    throw new AccountAlreadyExistsError()
                else break
            else
                currAccounts = currAccounts[accountCode[i]].accounts
        }


        /* TODO
        Implement DataBase Full
        eg input: 999.999
        but 999.999.999 already exists
        */
    }

    const insertAccount = () => {
        validateAccount()
        const accountCodeDepth = accountCode.length

        for (let i = 0, currAccounts: Account[] | undefined = accounts;
            i < accountCodeDepth;
            i++
        ) {
            if (i == accountCodeDepth - 1) {
                currAccounts[accountCode[i]] = {
                    id: accountCode.join("."),
                    accounts: []
                }
            } else currAccounts = currAccounts[accountCode[i]].accounts
        }
        setAccounts([...accounts])
    }

    const addAccount = () => {
        try {
            insertAccount()
        } catch (err) {
            if (err instanceof ParentDoesntExistsError) setError("Conta pai nao existe")
            if (err instanceof AccountAlreadyExistsError) setError("Conta ja existe")
        }
    }

    const mapAccount = (acc: Account): any => (
        acc && [
            <Text key={acc.id}>{Number(acc.id.split(".").map(i => Number(i) + 1).join("."))}</Text>,
            acc.accounts?.map(mapAccount)
        ])

    return (
        <>
            <>
                <Text>Conta</Text>
                <TextInput onChangeText={setCode} style={{ borderColor: 'black', borderWidth: 3 }} />
                <Button title="Criar" onPress={addAccount} />
            </>
            <>
                {suggestedCode && (
                    <>
                        <Text>Gostaria de criar a conta:</Text>
                        <Button title={(Number(suggestedCode) + 1).toString()} onPress={() => { }} />
                    </>
                )}

                <Text style={{ color: "red" }}>{error}</Text>
            </>
            <>{accounts.map(mapAccount)}</>
        </>
    )



}

export default Form;
