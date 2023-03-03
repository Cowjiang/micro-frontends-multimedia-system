import React, { useMemo, useRef, useState } from 'react';
import './index.less';
import type { Editor } from 'tinymce';
import { Editor as TinymceEditor } from '@tinymce/tinymce-react';
import { getTinymce } from '@tinymce/tinymce-react/lib/es2015/main/ts/TinyMCE';
import Loading from '@/components/Loading';
import { useModel, useNavigate, useParams } from '@@/exports';
import { Affix, Button, Input, Radio, Select, Steps, theme, Typography, Upload } from 'antd';
import classNames from 'classnames';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';

const {Title, Text} = Typography;
const {useToken} = theme;

const DraftEditPage: React.FC = () => {
  const navigate = useNavigate();
  const {projectId} = useParams();

  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorFillQuaternary, colorFillSecondary, colorFillTertiary} = token;

  const [imgUploading, setImgUploading] = useState(false);
  const uploadButton = <div>{imgUploading ? <LoadingOutlined /> : <PlusOutlined />}</div>;

  const [currentFormIndex, setCurrentFormIndex] = useState(0);

  const containerRef = useRef(null);
  const containerSize = useSize(containerRef);
  const editorRef = useRef<Editor | null>(null);

  const [loading, setLoading] = useState(true);
  const initValue = '';
  const [disabled, setDisabled] = useState(false);

  const headerContext = useMemo(() => (
    <>
      <Title level={1} className="mt-6">新建图文稿件</Title>
      <Steps
        className={classNames('h-full',
          containerSize?.width && containerSize.width >= 800 ? '!mt-8' : '!mt-2'
        )}
        current={currentFormIndex}
        onChange={setCurrentFormIndex}
        direction={containerSize?.width && containerSize.width < 800 ? 'horizontal' : 'vertical'}
        items={[
          {
            title: '填写稿件基本信息',
            description: '第一步'
          },
          {
            title: '编辑稿件内容',
            description: '第二步'
          },
          {
            title: '填写稿件详细信息',
            description: '第三步'
          }
        ]}
      />
    </>
  ), [containerSize, currentFormIndex]);

  return (
    <div className="draft-edit-page w-full h-full flex flex-col items-center">
      {
        containerSize?.width && containerSize.width < 800 && (
          <div className="min-w-[600px] w-4/5 max-w-[1500px] flex flex-col">
            {headerContext}
          </div>
        )
      }
      <div className="min-w-[600px] w-4/5 max-w-[1500px] flex" ref={containerRef}>
        {
          containerSize?.width && containerSize.width >= 800 && (
            <Affix offsetTop={30} target={() => document.querySelector('.ant-tabs-content') as HTMLElement | null}>
              <div
                className={classNames('min-w-[250px] h-[250px] mt-16',
                  {'min-w-[230px]': containerSize?.width && containerSize.width < 800}
                )}
              >
                {headerContext}
              </div>
            </Affix>
          )
        }
        <div
          className={classNames('flex-grow',
            {'ml-[3vw]': containerSize?.width && containerSize.width >= 800}
          )}
        >
          <div
            className={classNames('w-full mt-12 flex rounded-lg overflow-hidden',
              {'flex-col': containerSize?.width && containerSize.width < 900},
              {'hidden': currentFormIndex !== 0}
            )}
          >
            {/*基本信息*/}
            <div
              className={classNames('w-2/5 min-w-[40%] p-10 pt-2',
                {'!w-full': containerSize?.width && containerSize.width < 900}
              )}
              style={{background: colorFillTertiary}}
            >
              <Title level={2} className="mt-6">基本信息</Title>
              <span className="text-base">这里是稿件的基本信息，请填写并检查无误后再提交。</span>
            </div>
            <div
              className={classNames('w-3/5 min-h-[300px] p-12 flex flex-col',
                {'!w-full !p-10': containerSize?.width && containerSize.width < 900}
              )}
              style={{background: colorFillQuaternary}}
            >
              {/*基本信息*/}
              <div className="w-full">
                <Text type="secondary" strong>稿件名称</Text>
                <Input
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  size="large"
                  placeholder="请填写稿件名称"
                  // value={formValue.name}
                  // onChange={(e) => setFormValue({...formValue, name: e.target.value})}
                />
              </div>
              <div className="w-full mt-6">
                <Text type="secondary" strong>稿件描述</Text>
                <Input.TextArea
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  autoSize={{minRows: 2, maxRows: 5}}
                  size="large"
                  placeholder="请填写项稿件描述"
                  // value={formValue.description}
                  // onChange={(e) => setFormValue({...formValue, description: e.target.value})}
                />
              </div>
              <div className="w-full mt-6">
                <Text type="secondary" strong>稿件缩略图</Text>
                <Upload
                  className="!mt-2"
                  name="projectImage"
                  listType="picture-card"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  showUploadList={false}
                  // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  // beforeUpload={beforeUpload}
                  // onChange={handleChange}
                >
                  {uploadButton}
                </Upload>
              </div>
            </div>
          </div>
          <div
            className={classNames('w-full mt-6',
              {'hidden': currentFormIndex !== 1}
            )}
          >
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
                />
              </div>
            </Loading>
          </div>
          <div
            className={classNames('w-full mt-12 flex rounded-lg overflow-hidden',
              {'flex-col': containerSize?.width && containerSize.width < 900},
              {'hidden': currentFormIndex !== 2}
            )}
          >
            {/*详细信息*/}
            <div
              className={classNames('w-2/5 min-w-[40%] p-10 pt-2',
                {'!w-full': containerSize?.width && containerSize.width < 900}
              )}
              style={{background: colorFillTertiary}}
            >
              <Title level={2} className="mt-6">详细信息</Title>
              <span className="text-base">这里是稿件的详细信息，请填写并检查无误后再提交。</span>
            </div>
            <div
              className={classNames('w-3/5 min-h-[300px] p-12 flex flex-col',
                {'!w-full !p-10': containerSize?.width && containerSize.width < 900}
              )}
              style={{background: colorFillQuaternary}}
            >
              {/*基本信息*/}
              <div className="w-full flex flex-col">
                <Text type="secondary" strong>稿件标签</Text>
                <Select
                  className="w-full !mt-2"
                  mode="tags"
                  size="large"
                  placeholder="添加稿件标签"
                  // onChange={handleChange}
                  // options={options}
                />
              </div>
              <div className="w-full flex flex-col mt-6">
                <Text type="secondary" strong>发布渠道</Text>
                <Select
                  className="w-full !mt-2"
                  mode="multiple"
                  size="large"
                  placeholder="选择发布渠道"
                  // onChange={handleChange}
                  // options={options}
                />
              </div>
              <div className="w-full flex flex-col mt-6">
                <Text type="secondary" strong>私密稿件</Text>
                <Radio.Group
                  className="!mt-2"
                  buttonStyle="solid"
                  size="large"
                  value={0}
                >
                  <Radio.Button value={0}>
                    公开
                  </Radio.Button>
                  <Radio.Button
                    value={1}
                    style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                    disabled
                  >
                    私密
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div className="w-full mt-6">
                <Text type="secondary" strong>备注信息</Text>
                <Input.TextArea
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  autoSize={{minRows: 3, maxRows: 5}}
                  size="large"
                  placeholder="稿件备注信息"
                  // value={formValue.description}
                  // onChange={(e) => setFormValue({...formValue, description: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-12 flex">
            <Button
              className="ml-auto w-36 !h-14"
              type="primary"
              size="large"
              onClick={() => setCurrentFormIndex(currentFormIndex + 1)}
            >
              下一步
            </Button>
          </div>
          {/*底部*/}
          <div className="w-full h-36"></div>
        </div>
      </div>
    </div>
  );
};

export default DraftEditPage;
