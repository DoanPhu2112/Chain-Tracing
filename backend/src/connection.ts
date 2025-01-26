import { Client } from '@elastic/elasticsearch';

var client = new Client( {  
    node: 'http://localhost:9200',
    auth:{
        username: 'elastic',
        password: 'EZ87cZyY'
    }
  });
  export default client;