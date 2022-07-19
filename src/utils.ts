type ErrorType = {
    [index: string]: string
}

export const errorsAdapt = (errors: object[]) => {
    const adaptedErrors: ErrorType[] = []
    errors.map((el:any) => {
        adaptedErrors.push({message: el.msg, field: el.param})
    })
    if (adaptedErrors.length > 0) {
        return adaptedErrors
    } else return undefined

}