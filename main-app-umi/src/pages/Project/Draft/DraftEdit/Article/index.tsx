import React, { useEffect, useRef, useState } from 'react';
import { ArticleEditProps } from '@/pages/Project/Draft/DraftEdit/Article/typings';
import { Editor as TinymceEditor } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';
import Loading from '@/components/Loading';
import { Editor } from 'tinymce';
import { useModel } from '@@/exports';

const ArticleEdit: React.FC<ArticleEditProps> = (props: ArticleEditProps) => {
  const {darkTheme} = useModel('theme');

  const editorRef = useRef<Editor | null>(null);

  const [loading, setLoading] = useState(true);
  const initValue = props?.initialValue ?? '';
  const [disabled, setDisabled] = useState(false);

  const [value, setValue] = useState<string>(props.initialValue ?? '');
  useEffect(() => {
    props?.onValueChange && props.onValueChange(value);
  }, [value]);

  return (
    <Loading
      spinning={loading}
      size="large"
    >
      <div className="h-[75vh]">
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
          onEditorChange={setValue}
        />
      </div>
    </Loading>
  );
};

export default ArticleEdit;
