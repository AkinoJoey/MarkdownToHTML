let previewContent = "preview";
const previewContainer = document.getElementById('preview-container');
const previewBtn = document.getElementById('preview-btn');
const htmlBtn = document.getElementById('html-btn');
const downloadBtn = document.getElementById('download-btn');

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs' }});
    
require(['vs/editor/editor.main'], function() {
    const editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: '<!-- ここにmarkdownを入力してください -->\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
        language: 'markdown',
        automaticLayout: true 
    });

    editor.onDidChangeModelContent(async function(event) {
        const markdown = editor.getValue();
        let promise = returnParsedData(markdown);
        let parsedText = await promise;

        if(previewContent == "preview"){
            previewContainer.innerHTML = parsedText;

        }if (previewContent == "html") {
            monaco.editor.colorize(parsedText, 'html')
                .then(html => previewContainer.innerHTML = html);

        }
    });

    previewBtn.addEventListener('click',function(){
        if(previewContent == "html"){
            let promise =  returnParsedData(editor.getValue());

            promise.then(result => {
                previewContainer.innerHTML = result;
            }).catch(error => {
                console.error("Promiseでエラーが発生しました:", error);
            });
        }
    
        previewContent = "preview";
    })
    
    htmlBtn.addEventListener('click',function(){

        if(previewContent == "preview"){
            let promise =  returnParsedData(editor.getValue());

            promise.then(result => {
                monaco.editor.colorize(result, 'html')
                    .then(html => previewContainer.innerHTML = html);
            }).catch(error => {
                console.error("Promiseでエラーが発生しました:", error);
            });
        }
        previewContent = "html";
    })
    
    downloadBtn.addEventListener('click',async function(){
        if(previewContent == "html"){
            let html = previewContainer.textContent
            downloadHtml(html);

        }if(previewContent == "preview"){
            let promise =  returnParsedData(editor.getValue());
            let html = await promise;
            downloadHtml(html);
        }
    })
});

async function returnParsedData(bodyData){
    const requestOptions = {
        method:'POST',
        headers: {'Content-Type': 'text/plain'},
        body: bodyData
    }

    let parsedData = await fetch('parse.php', requestOptions)
                                .then(response => response.text());
        
    return parsedData;
}

function downloadHtml(text){
    fetch('download.php',{
        method: 'POST',
        headers:{'content-Type': 'text/html'},
        body:text
    })
        .then(response=> response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted.html';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        });
}


