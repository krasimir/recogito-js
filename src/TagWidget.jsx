/*

This file exists here just so I have a track of it.
It replaces the default autocomplete TagWidget from
node_modules/@recogito/recogito-client-core/src/editor/widgets/tag/TagWidget.jsx

*/
import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CloseIcon } from '../../../Icons';
import i18n from '../../../i18n';

import Autocomplete from '../Autocomplete';

const getDraftTag = existingDraft =>
  existingDraft ? existingDraft : {
    type: 'TextualBody', value: '', purpose: 'tagging', draft: true
  };

const TagWidget = props => {

  // All tags (draft + non-draft)
  const all = props.annotation ? 
    props.annotation.bodies.filter(b => b.purpose === 'tagging') : [];

  // Last draft tag goes into the input field
  const draftTag = getDraftTag(all.slice().reverse().find(b => b.draft)); 

  // All except draft tag
  const tags = all.filter(b => b != draftTag);

  const [ showDelete, setShowDelete ] = useState(false);

  const toggle = tag => _ => {
    if (showDelete === tag) // Removes delete button
      setShowDelete(false);
    else
      setShowDelete(tag); // Sets delete button on a different tag
  }

  const onDraftChange = value => {
    const prev = draftTag.value.trim();
    const updated = value.trim();

    if (prev.length === 0 && updated.length > 0) {
      props.onAppendBody({ ...draftTag, value: updated });
    } else if (prev.length > 0 && updated.length === 0) {
      props.onRemoveBody(draftTag);
    } else if (prev !== updated) {
      props.onUpdateBody(draftTag, { ...draftTag, value: updated });
    }
  }

  const onDelete = tag => evt => {
    evt.stopPropagation();
    props.onRemoveBody(tag);
  }

  const onSubmit = tag => {
    const toSubmit = tag.uri ? {
        type: 'SpecificResource',
        purpose: 'tagging',
        source: {
          id: tag.uri,
          label: tag.label
        }
      } : {
        type: 'TextualBody',
        purpose: 'tagging',
        value: tag.label || tag
      };

    if (draftTag.value.trim().length === 0) {
      props.onAppendBody(toSubmit);
    } else {
      props.onUpdateBody(draftTag, toSubmit); 
    }
  }

  // Shorthand
  const tagValue = tag => tag.value || tag.source.label;

  return (
    <div className="r6o-widget r6o-tag">
      <ul className="r6o-taglist">
        {
          props.vocabulary.map(word => {
            const styleButton = {
              border: 'none',
              padding: '0.5em 1em',
              fontSize: '0.9em',
              fontFamily: 'inherit',
              cursor: 'pointer',
              background: 'none',
              display: 'block',
              height: '100%',
              ':hover': {
                background: 'ececec'
              }
            };
            const styleSelected = {
              background: '#4483c4',
              color: '#FFF'
            }
            const tag = tags.find(t => word === tagValue(t));
            if (tag) {
              return (
                <li key={tagValue(tag)} onClick={toggle(tag)}>
                  <span className="r6o-label" style={styleSelected}>✔ {tagValue(tag)}</span>

                  {!props.readOnly &&
                    <CSSTransition in={showDelete === tag} timeout={200} classNames="r6o-delete">
                      <span className="r6o-delete-wrapper" onClick={onDelete(tag)}>
                        <span className="r6o-delete">
                          <CloseIcon width={12} />
                        </span>
                      </span>
                    </CSSTransition>
                  }
                </li>
              );
            }
            return (
              <li>
                <button key={word} style={styleButton} onClick={(e) => {
                  e.preventDefault();
                  onSubmit(word);
                }}>{word}</button>
              </li>
            );
          })
        }
      </ul>
    </div>
  )

}

export default TagWidget;