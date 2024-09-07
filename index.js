import { parse } from './gramatica/analyzer.js';
import { InterpreterVisitor } from './JS_Analyzer_parts/interpreter.js';

document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.querySelector('#run');
    const clearButton = document.querySelector('#clear');
    const openFileButton = document.querySelector('#open-file');
    const textarea = document.querySelector('#editor textarea');
    const consoleOutput = document.querySelector('#salida');
    const tabsContainer = document.querySelector('.tabs');
    const reportButton = document.querySelector('#reports');

    let currentTabId = 0;
    const tabs = {};
    let symbolTable = [];

    // Función para ejecutar el código en la textarea
    runButton.addEventListener('click', () => {
        try{
            const expresions = parse(textarea.value);
            console.log(expresions);
            const interpreter = new InterpreterVisitor();
            expresions.forEach(exp => {
                const result = exp.accept(interpreter);
            });
            const output = interpreter.salida.replace(/\n/g, '<br>'); 
            consoleOutput.innerHTML = output;
            // Guardar la tabla de símbolos
            if (Array.isArray(interpreter.listaSimbolos)) {
                symbolTable = interpreter.listaSimbolos;
            }
        } catch (e) {
            const errorMessage = `<span style="color: red;">Error: ${e.message}</span>`;
            console.error(e);
            consoleOutput.innerHTML = errorMessage;
        }

    });

    // Función para generar los reportes
    reportButton.addEventListener('click', () => {
        if (symbolTable.length > 0) {
            openSymbolTableReport(symbolTable);
        } else {
            alert('No symbol table available. Please run the code first.');
        }
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
        input.accept = '.oak';
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

function generateSymbolTableHTML(symbolList) {
    let tableHTML = `
        <html>
        <head>
            <title>Symbol Table Report</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f8f9fa;
                    color: #343a40;
                    padding: 20px;
                    margin: 0;
                }
                h1 {
                    text-align: center;
                    color: #495057;
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                th, td {
                    padding: 15px;
                    text-align: left;
                }
                th {
                    background-color: #007bff;
                    color: #fff;
                    font-weight: 600;
                }
                td {
                    border-bottom: 1px solid #dee2e6;
                    color: #495057;
                }
                tr:last-child td {
                    border-bottom: none;
                }
                tr:nth-child(even) {
                    background-color: #f2f2f2;
                }
                tr:hover {
                    background-color: #e9ecef;
                }
            </style>
        </head>
        <body>
            <h1>Symbol Table Report</h1>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Data Type</th>
                </tr>
    `;

    symbolList.forEach(symbol => {
        tableHTML += `
            <tr>
                <td>${symbol.ID}</td>
                <td>${symbol.Tipo}</td>
                <td>${symbol.TipoDato}</td>
            </tr>
        `;
    });

    tableHTML += `
            </table>
        </body>
        </html>
    `;

    return tableHTML;
}

function openSymbolTableReport(symbolList) {
    const reportHTML = generateSymbolTableHTML(symbolList);
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
}

