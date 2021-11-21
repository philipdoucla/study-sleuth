
let get_query = () => {
    const response = await fetch('https://api.ucla.edu/sis/publicapis/course/getallcourses')
    const data = await response.json()
    console.log(data);
}