let previewContent = "preview";
const previewBtn = document.getElementById('preview-btn');
const htmlBtn = document.getElementById('html-btn');
const downloadBtn = document.getElementById('download-btn');

previewBtn.addEventListener('click',function(){
    previewContent = "preview";
})

htmlBtn.addEventListener('click',function(){
    previewContent = "html";
    console.log(previewContent);
})

downloadBtn.addEventListener('click',function(){
    previewContent = "download";
})

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs' }});
    
require(['vs/editor/editor.main'], function() {
    const editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: '<!-- ここにmarkdownを入力してください -->',
        language: 'markdown'
    });


    editor.onDidChangeModelContent(function(event) {
        const markdown = editor.getValue();

        const requestOptions = {
            method:'POST',
            headers: {'Content-Type': 'text/plain'},
            body: markdown
        }
    
        fetch('parse.php', requestOptions)
            .then(response => response.text())
            .then(data => {
                const previewContainer = document.getElementById('preview-container');
                
                if(previewContent == "preview"){
                    previewContainer.innerHTML = data;

                }if (previewContent == "html") {
                    previewContainer.innerText = data;

                }if(previewContent == "download"){
                    console.log("download");                    
                }
                
            });
    });
});
