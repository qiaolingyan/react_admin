import React, { Component } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import PropTypes from 'prop-types';
import htmlToDraft from 'html-to-draftjs';
// import { EditorState, convertToRaw } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';

export default class RichTextEditor extends Component {
  static propTypes = {
    detail:PropTypes.string.isRequired
  };
  constructor(props){
    super(props);
    const blocksFromHtml = htmlToDraft(this.props.detail);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);
    this.state = {
      editorState
    };
  }
  
  
  onEditorStateChange = (editorState) => {
    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    this.setState({
      editorState,
    });
  };
  
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          // wrapperClassName="demo-wrapper"
          editorClassName="editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}