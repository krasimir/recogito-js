import React, { useState } from 'react';
import { TrashIcon } from '../../_recognito-client-core_/src/Icons';

const wrapperStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
}
const styleLink = {
  textDecoration: 'none',
  color: 'inherit'
}

const COLORS = {
  highlighted: '#FF0000',
  dim: '#cfcfcf'
}

export default function RelationEditorMenu({ connections, onDelete }) {
  const [selectedCon, setSelectedCon] = useState(-1);

  function highlightConnection(index) {
    if (index === selectedCon) {
      setSelectedCon(-1);
      connections.forEach((connection, i) => {
        connection.restoreColor();
      });
    } else {
      setSelectedCon(index);
      connections.forEach((connection, i) => {
        if (index === i) {
          connection.changeColor(COLORS.highlighted);
        } else {
          connection.changeColor(COLORS.dim);
        }
      });
    }
  }
  return (
    <div style={wrapperStyle}>
      {
        (connections || []).map((connection, i) => {
          const style = { ...styleLink };
          if (selectedCon === -1) {
            style.color = connection.color;
          } else {
            if (i === selectedCon) {
              style.color = COLORS.highlighted;
            } else {
              style.color = COLORS.dim;
            }
          }
          return (
            <div>
              <a href="javascript:void(0);" key={'k1' + style.color} style={style} onClick={() => highlightConnection(i)}>
                Con#{i+1}
              </a>&nbsp;&nbsp;
              <a href="javascript:void(0);" key={'k2' + style.color}  style={style} onClick={() => onDelete(connection.getRelation())}>
                <TrashIcon width={12}/>
              </a>
            </div>
          );
        })
      }
    </div>
  )
}