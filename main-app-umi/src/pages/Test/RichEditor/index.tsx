import React, { useRef, useState } from 'react';
import type { Editor } from 'tinymce';
import { Editor as TinymceEditor } from '@tinymce/tinymce-react';
import { getTinymce } from '@tinymce/tinymce-react/lib/es2015/main/ts/TinyMCE';
import Loading from '@/components/Loading';
import { useModel } from '@@/exports';
import { Button } from 'antd';

const RichEditorTestPage: React.FC = () => {
  const {darkTheme} = useModel('theme');
  const editorRef = useRef<Editor>(null);

  const log = () => {
    if (editorRef.current) {
      setEditorValue(editorRef.current.getContent());
    }
  };

  const [loading, setLoading] = useState(true);
  const initValue = '<h1>一二三四五六七</h1>\n' +
    '<h2>一二三<a href="#flag" name="comment">四五</a>六</h2>\n' +
    '<h3>一二三四五</h3>\n' +
    '<h4>一二三四</h4>';
  const [editorValue, setEditorValue] = useState('');
  const [selectedNode, setSelectedNode] = useState();

  const onSelectionChange = () => {
    const selection = editorRef.current?.selection.getSel();
    setAllowComment(false);
    if (selection?.type.toLowerCase() === 'range') {
      const {
        baseOffset,
        baseNode,
        extentOffset,
        extentNode
      } = selection ?? {};
      if (baseNode === extentNode) {
        const [startIndex, endIndex] = baseOffset < extentOffset ? [baseOffset, extentOffset] : [extentOffset, baseOffset];
        // console.log(start, end);
        // selectText(currentNode.data, start, end);
        // addTextWrapper();
        setAllowComment(true);
      } else {
        console.log('不在同一节点');
        setAllowComment(false);
      }
    }
  };
  const [allowComment, setAllowComment] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const handleClick = () => {
    console.log('你不要点我');
  };
  return (
    <div className="mx-auto">
      <Loading
        spinning={loading}
        size="large"
      >
        <div className="h-[500px]">
          <TinymceEditor
            key={darkTheme ? 'dark' : 'light'}
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            apiKey="7r39ggx9nkeyq2y3o5scbv5en93047bmpy3221wg2tnmr3qv"
            onInit={(evt, editor) => {
              editorRef.current = editor;
              setLoading(false);
            }}
            disabled={disabled}
            initialValue={initValue}
            init={{
              height: 500,
              language: 'zh-Hans',
              skin: darkTheme ? 'oxide-dark' : 'oxide',
              content_css: darkTheme ? 'dark' : 'default',
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor underline | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              menu: {
                file: {title: 'File', items: ''},
                edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace'},
                view: {
                  title: 'View',
                  items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments'
                },
                insert: {
                  title: 'Insert',
                  items: 'image link addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime'
                },
                format: {
                  title: 'Format',
                  items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat'
                },
                tools: {title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount'},
                table: {
                  title: 'Table',
                  items: 'inserttable | cell row column | advtablesort | tableprops deletetable'
                },
                help: {title: 'Help', items: 'help'}
              },
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              statusbar: false,
              resize: false
            }}
            onChange={log}
            // onSelectionChange={onSelectionChange}
          />
          <Button
            onClick={() => {
              editorRef.current?.execCommand('CreateLink', false, '#flag');
              const ownerDocument = editorRef.current?.getBody().ownerDocument;
              const result = ownerDocument?.evaluate(
                '//a[@href=\'#flag\']',
                ownerDocument.body,
                null,
                XPathResult.ANY_TYPE,
                null
              );
              if (result) {
                let node;
                const elementList: Element[] = [];
                while (node = result.iterateNext()) {
                  node.nodeType === Node.ELEMENT_NODE && elementList.push(node as Element);
                }
                elementList.forEach(element => {
                  element.setAttribute('name', 'comment');
                  element.setAttribute('custom', 'commentId');
                  element.addEventListener('click', handleClick);
                });
              }
            }}
          >
            添加批注
          </Button>
          <Button
            onClick={() => {
              editorRef.current?.getBody().ownerDocument.getElementsByName('comment').forEach((element) => {
                element.addEventListener('click', handleClick);
              });
              setDisabled(!disabled);
            }}
          >
            禁止编辑
          </Button>
          <Button
            onClick={() => {
              editorRef.current?.execCommand('Unlink');
            }}
          >
            移除批注
          </Button>
          <div dangerouslySetInnerHTML={{__html: editorValue}}></div>
        </div>
      </Loading>
    </div>
  );
};

export default RichEditorTestPage;
