'use strict'

const Book = use('App/Models/Book')
const Helpers = use('Helpers')
const Env = use('Env')
class BookController {
    async index ({ response }) {
        let books = await Book.all()
        var res = {

        }

        if(books != null){
          res = {
            status_code: 200,
            message: 'Success',
            data: books
          }
        } else {
          res = {
            status_code: 500,
            message: 'Failed',
            data: null
          }
        }

        return response.json(res)
    }

    async show ({ params, response }) {
        const book = await Book.find(params.id)
        
        return response.json(book)
    }

    async store ({ request, response }) {
      const bookInfo = request.only(['title', 'isbn', 'publisher_name', 'author_name'])
      const profilePic = request.file('url_photo', {
        types: ['image'],
        size: '2mb'
      })

      var fileName = ''
      var url_photo = ''
      var res = {

      }

      if(profilePic != null){
        fileName = `${new Date().getTime()}.${profilePic.subtype}`
        url_photo = Env.get('BASE_URL') + 'image/' + fileName
        
        await profilePic.move(Helpers.publicPath('image'), {
          name: fileName
        })
      } else {
        fileName = ''
        url_photo = ''
      }

      let booksBefore = await Book.all()

      const book = new Book()
      book.title = bookInfo.title
      book.isbn = bookInfo.isbn
      book.publisher_name = bookInfo.publisher_name
      book.author_name = bookInfo.author_name
      book.url_photo = url_photo
      
      await book.save()

      let booksAfter = await Book.all()

      if(booksAfter.size() > booksBefore.size()){  
        res = {
          status_code: 201,
          message : 'Success',
          data : book
        }
      } else {
        res = {
          status_code: 500,
          message : 'Failed',
          data : null
        }
      }
      return response.json(res)
    }

    async update ({params, request, response}) {
        const bookInfo = request.only(['title', 'isbn', 'publisher_name', 'author_name'])
        const book = await Book.find(params.id)
        var res = {

        } 

        if (!book) {
          res = {
            status_code: 404,
            message: 'Failed',
            data: null
          }

          return response.json(res)
        } else {
          const profilePic = request.file('url_photo', {
            types: ['image'],
            size: '2mb'
          })
    
          var fileName = ''
          var url_photo = ''
    
          if(profilePic != null){
            fileName = `${new Date().getTime()}.${profilePic.subtype}`
            url_photo = Env.get('BASE_URL') + 'image/' + fileName
            
            await profilePic.move(Helpers.publicPath('image'), {
              name: fileName
            })
          } else {
            fileName = ''
            url_photo = ''
          }

          book.title = bookInfo.title
          book.isbn = bookInfo.isbn
          book.publisher_name = bookInfo.publisher_name
          book.author_name = bookInfo.author_name
          book.url_photo = url_photo

          await book.save()

          res = {
            status_code: 200,
            message: 'Success',
            data: book
          }
  
          return response.json(res)
        }
      }

      async delete ({params, response}) {
        const book = await Book.find(params.id)
        
        if (!book) {
          return response.status(404).json({data: 'Resource not found'})
        }
        
        await book.delete()

        return response.status(204).json(null)
      }
}

module.exports = BookController
