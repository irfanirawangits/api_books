'use strict'

const Schema = use('Schema')

class AddColumnUrlPhotoBookSchema extends Schema {
  up () {
    this.table('books', (table) => {
      table.string('url_photo')
    })
  }

  down () {
    this.table('books', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddColumnUrlPhotoBookSchema
