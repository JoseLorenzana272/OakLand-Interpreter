# Manual de Usuario - OakLand.js - José Daniel Lorenzana Medina - 202206560

## Introducción

Este documento proporciona una guía para utilizar el intérprete de código desarrollado con una gramática PEG (Parsing Expression Grammar) y un archivo `index.js` que maneja la interfaz de usuario y la ejecución del código.

## Instalación de PEG

Para instalar PEG y compilar tu gramática, sigue estos pasos:

1. **Asegúrate de tener `npx` instalado**. Luego, abre tu terminal y ejecuta el siguiente comando para instalar y utilizar PEG:

    ```bash
    npx peggy -o output.js grammar.pegjs
    ```

    Este comando compila el archivo de gramática `grammar.pegjs` en un archivo de salida `output.js`, que puedes usar en tu intérprete.

## Uso del Intérprete

El intérprete proporciona una interfaz gráfica para escribir, ejecutar y gestionar código. A continuación, se describe cómo utilizar las diferentes funciones de la aplicación.

<img src="https://github.com/user-attachments/assets/1d76b480-84d6-4882-b2cf-2ca6c09d3474" alt="Texto alternativo" width="500" height="300">


### Componentes de la Interfaz

- **Botón `Run`**: Ejecuta el código presente en el área de texto. Limpia la consola y la lista de errores antes de ejecutar el código, y muestra los resultados y errores en la consola de salida.
- **Botón `Clear`**: Limpia el área de texto y la consola de salida.
- **Botón `Open File`**: Abre un archivo con extensión `.oak`. Permite abrir varios archivos a la vez en pestañas (tabs), cada uno con su contenido visible en una pestaña separada.
- **Botón `Reports`**: Genera y muestra un reporte de la tabla de símbolos si hay símbolos disponibles.

<img src="https://github.com/user-attachments/assets/91d4c84a-cf07-4c27-b3bf-b4aad388941a" alt="Texto alternativo" width="600" height="100">


### Funcionamiento

1. **Ejecutar Código**:
    - Escribe o pega tu código en el área de texto.
    - Haz clic en el botón `Run` para ejecutar el código. La salida del código y cualquier error serán mostrados en la consola de salida.

    <img src="https://github.com/user-attachments/assets/86d5de87-95ff-4a98-a83b-259035df36d5" alt="Texto alternativo" width="800" height="300">

2. **Limpiar el Editor y Consola**:
    - Haz clic en el botón `Clear` para limpiar el área de texto y la consola de salida.

3. **Abrir Archivos**:
    - Haz clic en el botón `Open File` para seleccionar un archivo `.oak`. El contenido del archivo se cargará en una nueva pestaña en el área de texto.

      <img src="https://github.com/user-attachments/assets/af935616-7321-4ed6-bd83-db5f104f3436" width="550" height="300">


4. **Generar Reportes**:
    - Haz clic en el botón `Reports` para generar un reporte de la tabla de símbolos. El reporte será abierto en una nueva ventana del navegador.

      <img src="https://github.com/user-attachments/assets/4865aea6-52a3-4da5-a0ee-bfb4347aa34a" width="550" height="300">


### Manejo de Pestañas

- **Cambio de Pestañas**: Puedes cambiar entre pestañas haciendo clic en la pestaña deseada. El contenido de la pestaña seleccionada se cargará en el área de texto.

  <img src="https://github.com/user-attachments/assets/84de8da5-1de1-4a22-b34a-d9dd4d451178" width="600" height="200">


### Reportes

El sistema genera dos tipos de reportes:

- **Reporte de la Tabla de Símbolos**: Muestra una tabla con los símbolos utilizados en el código.
- **Reporte de Errores**: Muestra una lista de errores encontrados durante la ejecución del código.

## Notas

- Asegurarse de que el archivo `index.js` esté correctamente vinculado con los archivos de gramática y los scripts necesarios para el funcionamiento del intérprete.
- La extensión de los archivos abiertos debe ser `.oak`, y la aplicación está diseñada para manejar múltiples archivos abiertos en pestañas.

## Contacto

Para preguntas o asistencia adicional, visita mi [GitHub](https://github.com/JoseLorenzana272).
