/**
 * Envuelve el contenido de cada página de la documentación para exponer su
 * versión Markdown a agentes de IA:
 *   - <link rel="alternate" type="text/markdown"> en el <head>
 *   - barra de acciones: copiar Markdown, ver .md y abrir la página en un
 *     asistente de IA con el enlace ya cargado.
 *
 * Solo aparece en las páginas que el plugin llms-txt publica en Markdown.
 */

import React, { type ReactNode } from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type { WrapperProps } from '@docusaurus/types';
import AiPageActions from '@site/src/components/AiPageActions';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): ReactNode {
  return (
    <>
      <AiPageActions />
      <Content {...props} />
    </>
  );
}
