function pluck(objects, fieldName){
	return objects.map(f => f[`${fieldName}`])
}

function partition(array, p){
	return [array.filter(p), array.filter(f => p(f) ? false : true)];
};