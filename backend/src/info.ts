import client from './connection';

client.cluster.health({})
  .then((resp) => {
	// handle response
    console.log(resp);
  })
  .catch((err) => {
	// handle error
    console.error(err);
  });
