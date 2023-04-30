
export default {
  data(){
    return{
      language: 'zh',
      languageOptions: ['zh','en','other']
    }
  },
  methods:{
    createLanguageStringParameter(){
      return {
        'zh': '',
        'en': ''
      }
    },
    createLanguageNumberParameter(){
      return {
        'zh': 0,
        'en': 0
      }
    },
  }
}
