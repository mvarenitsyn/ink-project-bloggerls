type ErrorType = {
    [index: string]: string
}

export const errorsAdapt = (errors: object[]) => {
    const adaptedErrors: object[] = []
    errors.map((el:any) => {
        const msg:string = el.msg.toString()
        const param:string = el.param.toString()
        adaptedErrors.push({"message": msg, "field": param})
    })
    if (adaptedErrors.length > 0) {
        return adaptedErrors
    } else return undefined

}