import { writable } from 'svelte/store';
 
const count = writable([]);
 
count.subscribe((value) => {
  console.log(value);
}); // logs '0'
 
count.set(1); // logs '1'
 