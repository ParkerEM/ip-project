import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/accent-card/accent-card.js';
 
export class NasaImageSearch extends LitElement {
   static get tag() {
     return 'nasa-image-search';
   }

   constructor() {
    super();
    this.term = "Moon landing";
    this.images = [];
    this.page = 3;
    this.startDate = 2000;
    this.endDate = 2020;
  }

   static properties = {
     term: {},
     images: {},
     page: {},
     startDate: {},
     endDate: {}
   };
   
   /*firstUpdated(changedProperties) {
     if (super.firstUpdated) {
       super.firstUpdated(changedProperties);
     }
     this.getData();
   }*/

   updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'loadData' && this[propName]) {
        this.getData();
      }
      // when dates changes, fire an event for others to react to if they wish
      else if (propName === 'dates') {
        this.dispatchEvent(
          new CustomEvent('results-changed', {
            detail: {
              value: this.dates,
            },
          })
        );
      }
    });
  }

  async getData() {
    fetch(`https://images-api.nasa.gov/search?q=${this.term}&page=${this.page}&year_start=${this.startDate}&year_end=${this.endDate}&media_type=image`)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        this.images = [];
        for (let i = 0; i < data.collection.items.length; i++) {
          const results = {
            image: data.collection.items[i].links[0].href,
            description: data.collection.items[i].data[0].description,
            title: data.collection.items[i].data[0].title,
            creator: data.collection.items[i].data[0].secondary_creator,
          };
          this.images.push(results);
        }
      });
  }
  

   render() {
    return html`
            ${this.images.map(
              item => html`
              <accent-card image-src="${item.image}" accent-color="black" horizontal style="max-width:1000px;">
                <div slot="heading">${item.title}</div>
                <div slot="content">Description: ${item.description}</div> 
                <div slot="content">Photography: ${item.creator}</div>
              </accent-card>
            `)}
          `}
    ;
}

 customElements.define(NasaImageSearch.tag, NasaImageSearch);
 

