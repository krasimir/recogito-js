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

export default function AnnotationsEditor({ annotations, onDelete }) {
  const [selectedCon, setSelectedCon] = useState(-1);

  console.log(groupAnnotations(annotations));

  return (
    <div style={wrapperStyle}>
      {
        // (connections || []).map((connection, i) => {
        //   const style = { ...styleLink };
        //   if (selectedCon === -1) {
        //     style.color = connection.color;
        //   } else {
        //     if (i === selectedCon) {
        //       style.color = COLORS.highlighted;
        //     } else {
        //       style.color = COLORS.dim;
        //     }
        //   }
        //   return (
        //     <div>
        //       <a href="javascript:void(0);" key={'k1' + style.color} style={style} onClick={() => highlightConnection(i)}>
        //         Con#{i+1}
        //       </a>&nbsp;&nbsp;
        //       <a href="javascript:void(0);" key={'k2' + style.color}  style={style} onClick={() => onDelete(connection.getRelation())}>
        //         <TrashIcon width={12}/>
        //       </a>
        //     </div>
        //   );
        // })
      }
    </div>
  )
}

function groupAnnotations(annotations) {
  let id = 1;
  const getId = () => `G${id++}`;
  const links = annotations.filter(a => a.motivation === 'linking');
  const getAnnotation = id => annotations.find(a => a.id === id);
  const groups = {};
  const consumedLinks = {};

  function processLink(link, gId) {
    if (consumedLinks[link.id]) return;
    consumedLinks[link.id] = true;
    const groupId = gId || getId();
    if (!groups[groupId]) {
      groups[groupId] = [];
    };
    link.target.forEach(({ id }) => {
      if (!groups[groupId].find(({ id: aId }) => aId === id)) {
        groups[groupId].push(getAnnotation(id));
      }
      const linksWithSameAnnotation = links.filter(l => l.target.find(t => t.id === id));
      linksWithSameAnnotation.forEach(link => processLink(link, groupId));
    });
  }

  links.forEach(link => processLink(link));

  return groups;
}
