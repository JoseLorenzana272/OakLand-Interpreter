import { parse } from './JS_Analyzer_parts/analyzer.js';
import { InterpreterVisitor } from './JS_Analyzer_parts/interpreter.js';

document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.querySelector('#run');
    const clearButton = document.querySelector('#clear');
    const openFileButton = document.querySelector('#open-file');
    const textarea = document.querySelector('#editor textarea');
    const consoleOutput = document.querySelector('#salida');
    const tabsContainer = document.querySelector('.tabs');

    let currentTabId = 0;
    const tabs = {};

    // Función para ejecutar el código en la textarea
    runButton.addEventListener('click', () => {
        const codigoFuente = textarea.value; // Usa .value para textarea
        const sentencias = parse(codigoFuente);

        const interprete = new InterpreterVisitor();

        console.log({ sentencias });
        sentencias.forEach(sentencia => sentencia.accept(interprete));

        consoleOutput.innerHTML = interprete.salida;
    });

    // Función para limpiar la textarea y la consola
    clearButton.addEventListener('click', () => {
        textarea.value = '';
        consoleOutput.innerHTML = '';
    });

    // Función para abrir un archivo .txt
    openFileButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.style.display = 'none';

        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Crear una nueva pestaña
                    const tabId = currentTabId++;
                    const tab = document.createElement('div');
                    tab.className = 'tab';
                    tab.textContent = file.name;
                    tab.dataset.tabId = tabId;
                    tab.addEventListener('click', () => {
                        switchToTab(tabId);
                    });

                    tabsContainer.appendChild(tab);

                    // Agregar el contenido del archivo al textarea
                    textarea.value = e.target.result;

                    // Guardar el contenido del archivo en el objeto tabs
                    tabs[tabId] = {
                        name: file.name,
                        content: e.target.result
                    };

                    // Seleccionar la nueva pestaña
                    switchToTab(tabId);
                };
                reader.readAsText(file);
            }
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    });

    function switchToTab(tabId) {
        // Cambiar al contenido de la pestaña seleccionada
        const tab = tabs[tabId];
        if (tab) {
            textarea.value = tab.content;
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.tab[data-tab-id="${tabId}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
        }
    }
});
