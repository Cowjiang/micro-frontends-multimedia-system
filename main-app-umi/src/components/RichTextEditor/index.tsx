import React from 'react';
import { Editor as TinymceEditor, IAllProps } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';
import { useModel } from '@@/exports';

const RichTextEditor: React.FC<IAllProps> = (props) => {
  const {darkTheme} = useModel('theme');

  return (
    <TinymceEditor
      key={darkTheme ? 'dark' : 'light'}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      apiKey="7r39ggx9nkeyq2y3o5scbv5en93047bmpy3221wg2tnmr3qv"
      init={{
        height: '100%',
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
      {...props}
    />
  );
};

export default RichTextEditor;
