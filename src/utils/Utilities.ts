import moment from 'moment'
import 'moment/dist/locale/pt-BR'
import 'moment-timezone'

export default class Utilities {

  private static removeWhiteSpaces (str: string) {
    return str.replace(/\s+/g, ' ').trim()
  }

  static createMultiPartFormData (input: Record<any, any>): any {
    const formData = new FormData()
    const keys = Object.keys(input)

    for (const key of keys) {
      formData.append(key, input[key])
    }

    return formData
  }

  static dateFormat (date: Date | string, format: string): string {
    if (!date) return ''
    moment.locale('pt-BR')
    return moment(date).format(format)
  }

  static utcDateToString (date: Date) {
    return moment.tz(date, 'America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss.SSS')
  }

  static currentFirstDay (): Date {
    return moment.tz('America/Sao_Paulo')
      .startOf('month')
      .toDate()
  }

  static currentLastDay (): Date {
    return moment.tz('America/Sao_Paulo')
      .endOf('month')
      .toDate()
  }

  static creteNextQuotas (date: Date, incrementMount: number): Date {
    const newDate = new Date(date)
    newDate.setDate(1)
    return new Date(newDate.setMonth(newDate.getMonth() + incrementMount))
  }

  static currencyFormat (value: number | bigint, locale: string, currency: string): string {
    return this.removeWhiteSpaces(
      Intl.NumberFormat(locale, {
        style: 'currency',
        currency
      }).format(value)
    )
  }

  static sleep (time: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, time)
    })
  }

  static formatThousands (value: number): string {
    return this.removeWhiteSpaces(
      Intl.NumberFormat('pt-BR', {
        maximumSignificantDigits: 3,
        notation: 'compact'
      }).format(value)
    )
  }

  static round (number: number): number {
    return Number(number.toFixed(2))
  }

  static downloadFile (fileName: string, extension: string, content: any, type: string): void {
    const blob = new Blob([content], { type })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${fileName}.${extension}`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  static debouncer (callback: () => void, timeOut: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(async () => {
      callback()
      timeoutId = null
    }, timeOut)
  }

  static camelToTitleCase (camelStr: string) {
    return camelStr
      .replace(/([A-Z])/g, ' $1') // Adiciona um espaço antes de cada letra maiúscula
      .replace(/^./, str => str.toUpperCase()) // Coloca a primeira letra da string em maiúscula
      .split(' ') // Divide em palavras
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza cada palavra
      .join(' ') // Junta com espaços entre as palavras
  }
}