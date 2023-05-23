const puppeteer = require ('puppeteer');
const randomUseragent = require('random-useragent');
const ExcelJS = require('exceljs');

const saveExcel =(data) =>{
    const workbook = new ExcelJS.Workbook();
  
    const fileName = 'acto.publico.antropologia.xlsx'
    
    const sheet = workbook.addWorksheet('Resutados');
   
    const reColumns = [

        {header: "MATERIA" , key:'materia'},
        //{header:"ESCUELA" , key:'escuela'},
        {header: "LINK" , key:'link'}
    ]

sheet.columns = reColumns;
sheet.addRows(data);
workbook.xlsx.writeFile (fileName).then((e)=>{

    console.log ('Creado exitosamente');
})
.catch(() => {
    console.log('algo susedio guadando el excel')
})

}

const initialization = async() => {

    const header = randomUseragent.getRandom (); //genera un username aleatorio

    const browser = await puppeteer.launch(); //abrimos el navegador

    const page = await browser.newPage(); 

    await page.setUserAgent(header); //asignamos el usuario random creado

    await page.setViewport ({ width:1920, height: 1080});  // setamos la pantalla

    await page.goto('https://actopublico.bue.edu.ar/?status_map=1&status_expand_map=&status_carousel=1&concurso=&areas%5B%5D=0&cargos%5B%5D=0&asignaturas%5B%5D=102&asignaturas%5B%5D=33&asignaturas%5B%5D=245&asignaturas%5B%5D=306&asignaturas%5B%5D=1097&asignaturas%5B%5D=522&asignaturas%5B%5D=1124&asignaturas%5B%5D=1186&asignaturas%5B%5D=1428&asignaturas%5B%5D=2459&asignaturas%5B%5D=72&asignaturas%5B%5D=192&asignaturas%5B%5D=84&asignaturas%5B%5D=1431&asignaturas%5B%5D=345&asignaturas%5B%5D=101&asignaturas%5B%5D=2226&asignaturas%5B%5D=1090&especialidades%5B%5D=0&escuelas%5B%5D=0');
    await page.screenshot({ path: 'captura-de-prueba.png' }); //saca un screenshot

    await page.waitForSelector('.main-content'); //busco una clase (.ljhb),un id (#kh), o un elemento (sdf)
    
    const listaDeItems = await page.$$('.col-lg-6'); //busco la clase del item iterado

    let data = [];  //creo una variable data (para el excel)

    for (const item of listaDeItems) {   //para cada item repetido (cargos disponibles)



        const materia = await item.$('.label-success');  //espero al item que me interesa
        //const link = await item.$('.??????');
        const link = await item.$("a");

        const getMateria = await page.evaluate(materia => materia.innerText, materia); // ..y le hago una especie de getter (?
        //const getEscuela = await page.evaluate(escuela => escuela.innerText, escuela);
        const getLink = await page.evaluate(link => link.getAttribute('href'), link);
        //console.log(`${getmateria}-----${getEscuela}---${getlink}`);  
        console.log(`${getMateria}---${getLink}`);  
        
        data.push({                     //y lo pusheo a data para el excell
            materia: getMateria,
            //escuela:getEscuela,
            link: getLink
        })

    }

    
    await browser.close();
    saveExcel(data);
}




initialization ();

//Array.from(document.getElementsByTagName("p")).filter(x => x.innerText.includes("no se han encontrado resultados para la búsqueda."))