import moment from 'moment'

export function useDate() {
  const dateFromStr = dateStr => {
    if(!dateStr){
      return null
    }
    const m = moment(dateStr)
    if(m.isValid()){
      return m.toDate()
    }
    
    return null
  }

  const format = (dateStr, format) => {
    const date = moment(dateStr)
    if(date.isValid()){
      return date.format(format)
    }
    
    return '-'
  }

  const formatDate = (date, format) => {
    const m = moment(date)
    if(m){
      return m.format(format)
    }
    
    return '-'
  }

  const dateDiff = (fromDateStr, toDateStr) => {
    const f = moment(fromDateStr)
    const t = moment(toDateStr)
    
    return parseInt(f.diff(t, 'seconds'))
  }

  return { format, formatDate, dateFromStr, dateDiff }
}

export const timeQueryFormat = 'yyyy-MM-DD HH:mm:ss'