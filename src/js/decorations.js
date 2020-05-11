import proj4 from 'proj4'

export default [{
  extendFeature() {
    this.set(
      'search_label',
      '<b><span class="srch-lbl-lg">' + this.getName() + 
      '</span></b><br><span class="srch-lbl-sm">' + this.getFullAddress() + '</span>'
    )
  },
  getFullAddress() {
    return `${this.get('Address')}, ${this.get('Borough')}, NY`
  },
  getName() {
    return this.get('Full site name')
  },
  getAddress1() {
    return this.get('Address')
  },
  getCityStateZip() {
    return `${this.get('Borough')}, NY`
  },
  getTip() {
    return this.get('search_label')
  },
  detailsCollapsible() {
    const walkIn = this.get('Walk-in?') === 'Y' ? 'Yes' : 'No'
    const nycha = this.get('NYCHA priority site?') === 'Y' ? 'Yes' : 'No'
    return $('<div class="detail"></div>')
      .append(`<strong>Walk in facility: </strong> ${walkIn}`)
      .append(`<strong>NYCHA priority site: </strong> ${nycha}`)
      .append(`<strong>Prioritization criteria:<br></strong> ${this.get('Prioritization criteria')}`)
  }
}]