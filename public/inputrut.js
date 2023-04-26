 /*Esta línea de código utiliza el método querySelector() del objeto document para obtener una referencia
al elemento HTML con el ID inputRut. Este elemento es un campo de entrada (input) donde el usuario puede ingresar un número de RUT.*/

const inputRut = document.querySelector('#inputRut');

/*Luego, se agrega un event listener al elemento inputRut.  */
inputRut.addEventListener('input',buscarPorRut);
    function buscarPorRut() {
        /*En primer lugar, se obtiene el valor ingresado por el usuario y se convierte a minúsculas
        y se elimina los espacios en blanco del principio y final */
        const valor = inputRut.value.toLowerCase().trim();

        /* el método querySelectorAll() para obtener una lista de todas las filas (tr) dentro del elemento HTML
        con el ID "example".Este elemento es la tabla donde se mostrarán los datos de la búsqueda.*/
        const filas = document.querySelectorAll('#example tbody tr');

        filas.forEach(fila => {
            /*el método querySelector() en la fila y se selecciona el tercer elemento td
            (ya que la columna de RUT es la tercera columna en la tabla) y se obtiene su contenido de texto (textContent).
            Luego, se convierte a minúsculas.*/
            const rut = fila.querySelector('td:nth-child(3)').textContent.toLowerCase();

            /*Si el valor ingresado por el usuario está incluido en el valor del RUT de la fila actual,
            se muestra la fila estableciendo el valor de la propiedad display
            de la fila en una cadena vacía (''). De lo contrario, se oculta la fila estableciendo el valor de la propiedad display en 'none'. */
            if (rut.includes(valor)) {
                fila.style.display = '';
            } else {
            fila.style.display = 'none';
            }
        });
    }
    // export default buscarPorRut; // for
   