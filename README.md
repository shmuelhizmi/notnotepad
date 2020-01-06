# NotNotePad - [Live Demo](https://notnotepad.now.sh/)

![blockly](https://i.imgur.com/R8JeW47.jpg)
![code](https://i.imgur.com/zGOSyjw.jpg)

# What is NotNotePad
lets take the idea of programming
  
> **code (text)=> code interpreter/compiler=> machine code (binary data)**

 now when trying to improve this process we can encounter a few problems like

1. any changes in the code syntax will require every user to update is interpreter and every program or library to update its code base, witch can result in mostly small or non-breaking changes every generation.
2. sometimes code syntax witch is easy to write can be harder to interpret.
3. for some people coding in general is not the best way to program especially for people in the creative area like designers.   

that's why we have tools like:
  - bable (code translator)
>    **es6 + jsx=> raw js=> code interpreter**

  - wix (web builder)
>    **visual editor=> html=> html renderer**

  - unreal engine blueprints
>    **visual editor=> compiled data=> cpp interpreter**
   
  - google blockly
>    **visual editor=> compiled code=> interpreter/compiler**
   
those tools solve this problem by adding an additional layer to this proccess that act like some sort of code translators/generators

NotNotePad design to be a home for all kinds of code translators/generators as long as they can fit as a component in this model :

>    **editor component=> editor data=> code=> interpreter/compiler**

![component](https://svgur.com/i/H97.svg)
    
code example :
```jsx
import "react"
import "code-editor"

class componenet-x extends code-editor{
  reder(){
    <input type="text" onChange={(text)=>{//input for json html
        this.saveData(text); //save json as editor data
        this.saveCode(compileJsonToHtml(text)) //compile json to html and save code
      }} />
  }
}
```


**to start run:**

1. `yarn`
2. `yarn start`
- or just visit our [demo](https://notnotepad.now.sh/)

## features

- **multi editor**
  1.  [monaco](https://github.com/microsoft/monaco-editor) editor ([vs-code](https://github.com/microsoft/vscode) like) - [react monaco editor]((https://github.com/react-monaco-editor/react-monaco-editor)
  2.  [blockly](https://github.com/google/blockly) html editor
  3.  json tree editor - [react-json-view](https://github.com/mac-s-g/react-json-view)
  4.  ckeditor 4 and 5 html editor - [ckeditor4-react](https://github.com/ckeditor/ckeditor4-react) , [@ckeditor/ckeditor5-react](https://github.com/ckeditor/ckeditor5-react)
  5.  codemiror - [react-codemirror2](https://github.com/scniro/react-codemirror2), [codemirror](https://codemirror.net/)
  6.  MD editor - [react-mde](https://github.com/andrerpena/react-mde)
- **full node like file system** - [BrowserFS](https://github.com/jvilk/BrowserFS)
- **static hosting with now** - [zeit](https://zeit.co/home)
- **live code/page view**
- **extensions system not finished**

## todo

- extensions market place
- git panel
- js packages support
