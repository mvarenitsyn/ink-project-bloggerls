type ErrorType = {
    [index: string]: string
}

export const errorsAdapt = (errors: object[]) => {
    const adaptedErrors: ErrorType[] = []
    errors.map((el:any) => {
        adaptedErrors.push({message: el.msg.toString(), field: el.param.toString()})
    })
    if (adaptedErrors.length > 0) {
        return adaptedErrors
    } else return undefined

}