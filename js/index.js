//EDITOR VARIABLES
var selected = null
var option = "point"

//AREA DATA
var area = {
    width: 1000,
    height: 500,
    scale: 1,
    rotation: 0,
    bounds: {},
    rooms: []
}

const to_coords = coord_string => {
    const coord = coord_string.split(",")
    const [x,y] = coord
    return {x, y}
}

//VIEW CONTROL
const view = document.querySelector("#view");
view.addEventListener("click", e => {

    if(option == "point"){
        createPoint(e)
    } else if(option == "delete"){
        deletePoint(e)
    }
    updateUI()
    
    pointEventsHandler()
    
})

//DATA CONTROL

const connect = (selected, curr) => {
    const selected_str = `${selected.x},${selected.y}`
    const curr_str = `${curr.x},${curr.y}`
    //If already connected to two return
    //If already connected to curr delete connection
    //Else connect selected and curr
    if(area.bounds[selected_str].includes(curr_str)){
        area.bounds[selected_str] = area.bounds[selected_str].filter(coord => coord != curr_str)
        area.bounds[curr_str] = area.bounds[curr_str].filter(coord => coord != selected_str)
    }else{
        for(let edge in area.bounds){
            const coord = to_coords(edge)
            if(coord.x == curr.x && coord.y == curr.y){
                area.bounds[edge].push(`${selected.x},${selected.y}`)
            } else if(coord.x == selected.x && coord.y == selected.y){
                area.bounds[edge].push(`${curr.x},${curr.y}`)
            }
        }
    }

    console.log(`connected (${curr.x}, ${curr.y}) with (${selected.x}, ${selected.y}) `)
}

const pointEventsHandler = () => {
    if(option == "point" ){
        let points = document.querySelectorAll(".point");
        points.forEach(point => {
            point.addEventListener("click", e => selectPoint(e))    
        })
        const selectPoint = e => {
            const x = e.target.cx.animVal.value
            const y = e.target.cy.animVal.value
            const curr = {x, y}
            if(selected){
                if(selected.x == curr.x && selected.y == curr.y){
                    selected = null
                } else {
                    console.log(curr)
                    connect(selected, curr)
                    selected = curr //Option == Line
                    //selected = null //Option == Point 
                }
            } else{
                selected = curr
                console.log(selected)
            }
        }
    }
}



//UI CONTROL
const updateUI = () => {
    let svg_edges = ""
    let svg_vertices = ""

    for(let edge in area.bounds){
        let coords = to_coords(edge)
        let selected_str = selected ? `${selected.x},${selected.y}` : ""
        const {x, y} = coords
        svg_edges += `<circle cx=${x} cy=${y} class="point" r="2" stroke="${edge == selected_str ? "orange": "lightgreen"}" stroke-width="7" />`
        area.bounds[edge].forEach(vertex => {
            let vcoords = to_coords(vertex)
            svg_vertices += `<line x1=${x} y1=${y} x2=${vcoords.x} y2=${vcoords.y} style="stroke:black;stroke-width:2" />`
        })
    }
  

    let shape = `
    <svg width="1000" height="500">
        ${svg_edges}
        ${svg_vertices}
    </svg>
    
    `
    
    view.innerHTML = shape
    
}



//OPTION - FUNCTIONS
const selectOption = opt => {
    option = opt 
}
const createPoint = e => {
     if(!e.target.classList.contains("point")) {
        const {layerX, layerY} = e
        area.bounds[`${layerX},${layerY}`] = []
        //Option == Line
        if(selected){
            area.bounds[`${layerX},${layerY}`].push(`${selected.x},${selected.y}`)
            
        }
        //Option == Line
        selected = {x: layerX, y: layerY}
    }
}

const deletePoint = e => {
    const {layerX, layerY} = e 
    const coords = `${layerX},${layerY}`
    if(e.target.classList.contains("point") && area.bounds.hasOwnProperty(coords)) {  
        delete area.bounds[coords]
        for(let edge in area.bounds){
            area.bounds[edge] = area.bounds[edge].filter(c => c != coords)
        }
   }
}



