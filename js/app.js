let previewContent = "preview";
const previewContainer = document.getElementById('preview-container');
const previewBtn = document.getElementById('preview-btn');
const htmlBtn = document.getElementById('html-btn');
const downloadBtn = document.getElementById('download-btn');

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs' }});
    
require(['vs/editor/editor.main'], function() {
    const editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: '<!-- ここにmarkdownを入力してください -->\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
        language: 'markdown'
    });

    editor.onDidChangeModelContent(async function(event) {
        const markdown = editor.getValue();
        let promise = returnParsedData(markdown);
        let parsedText = await promise;

        if(previewContent == "preview"){
            previewContainer.innerHTML = parsedText;

        }if (previewContent == "html") {
            previewContainer.innerText = parsedText;

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
                previewContainer.innerText = result;
            }).catch(error => {
                console.error("Promiseでエラーが発生しました:", error);
            });
        }
        previewContent = "html";
    })
    
    downloadBtn.addEventListener('click',function(){
        console.log("download");
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