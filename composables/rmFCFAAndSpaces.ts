/*export function removeFCFAAndSpaces(inputString: string): string {
  return inputString.replace(/F CFA|\s/g, "");
}*/

// It will be available as useFoo() (camelCase of file name without extension)
 

// It will be available as useFoo() (camelCase of file name without extension)
// It will be available as useFoo() (camelCase of file name without extension)
export default function (data:any) {
  return useState("rm_fcfa", () =>{
  
       return data.replace(/F CFA|\s/g, "");
  });
}