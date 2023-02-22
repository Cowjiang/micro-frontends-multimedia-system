import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Loading from '@/components/Loading';

const RichEditorTestPage: React.FC = () => {
  const editorRef = useRef<any>(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const [loading, setLoading] = useState(true);
  const initValue = '<p>初始值</p>';

  return (
    <div className="w-[80vw] mx-auto">
      <Loading
        spinning={loading}
        size="large"
      >
        <div className="h-[500px]">
          <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            apiKey="7r39ggx9nkeyq2y3o5scbv5en93047bmpy3221wg2tnmr3qv"
            onInit={(evt, editor) => {
              editorRef.current = editor;
              setLoading(false);
            }}
            initialValue={initValue}
            init={{
              height: 500,
              language: 'zh-Hans',
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              menu: {
                file: { title: 'File', items: '' },
                edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
                insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
                format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
                tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
                table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
                help: { title: 'Help', items: 'help' }
              },
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              statusbar: false,
              resize: false
            }}
          />
        </div>
      </Loading>
    </div>
  );
};

export default RichEditorTestPage;
