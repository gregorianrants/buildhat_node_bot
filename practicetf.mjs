import * as tf from "@tensorflow/tfjs";

let t = tf.zeros([10, 10]).print();

console.log(t.slice([]));
