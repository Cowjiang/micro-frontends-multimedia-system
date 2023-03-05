import React, { useEffect, useRef, useState } from 'react';
import { ArticleEditProps } from '@/pages/Project/Draft/DraftEdit/Article/typings';
import Loading from '@/components/Loading';
import { Editor } from 'tinymce';
import RichTextEditor from '@/components/RichTextEditor';

const ArticleEdit: React.FC<ArticleEditProps> = (props: ArticleEditProps) => {
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
        <RichTextEditor
          onInit={(evt, editor) => {
            editorRef.current = editor;
            setLoading(false);
          }}
          disabled={disabled}
          initialValue={initValue}
          onEditorChange={setValue}
        />
      </div>
    </Loading>
  );
};

export default ArticleEdit;
