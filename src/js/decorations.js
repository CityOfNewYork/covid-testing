import proj4 from 'proj4'

export default [{
  extendFeature() {
    this.set(
      'search_label',
      '<b><span class="srch-lbl-lg">' + this.getName() + 
      '</span></b><br><span class="srch-lbl-sm">' + this.getFullAddress() + '</span>'
    )
  },
  html() {
    return $('<div class="facility"></div>')
      .addClass(this.cssClass())
      .append(this.distanceHtml())
      .append(this.nameHtml())
      .append(this.distanceHtml(true))
      .append(this.addressHtml())
      .append(this.details())
      .append(this.mapButton())
      .append(this.directionsButton())
      .data('feature', this)
      .mouseover($.proxy(this.handleOver, this))
      .mouseout($.proxy(this.handleOut, this))
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
  details() {
    const walkIn = this.get('Walk-in?') === 'Y' ? 'Yes' : 'No'
    const nycha = this.get('NYCHA priority site?') === 'Y' ? 'Yes' : 'No'
    const criterior =  this.get('Prioritization criteria')
    const details = $('<div class="detail"></div>')
      .append(`<div><strong>Walk in facility: </strong> ${walkIn}</div>`)
      .append(`<div><strong>NYCHA priority site: </strong> ${nycha}</div>`)
    if (criterior) {
      details.append(`<div><strong>Prioritization criteria:<br></strong> ${criterior}</div>`)
    }
    return details
  }
}]