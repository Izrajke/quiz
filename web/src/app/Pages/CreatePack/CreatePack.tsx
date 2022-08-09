import { useEffect } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import { CreatePackMainSection } from './CreatePackMainSection';
import { CreatePackQuestionSection } from './CreatePackQuestionSection';

import { useLocation, useParams } from 'react-router';

export enum ViewPackTypes {
  create = 'create',
  view = 'view',
  // TODO:  добавить Edit когда появится
  // edit = 'edit',
}

interface CreatePackProps {
  viewType: ViewPackTypes;
}

export const CreatePack: FunctionComponent<CreatePackProps> = observer(
  ({ viewType }) => {
    const { createPack } = useStore();
    const { pathname } = useLocation();

    const { id } = useParams();

    useEffect(() => {
      createPack.init(viewType, id);

      return () => {
        createPack.clear();
      };
      // eslint-disable-next-line
    }, [pathname]);

    return (
      <>
        <CreatePackMainSection />
        <CreatePackQuestionSection />
      </>
    );
  },
);

CreatePack.displayName = 'CreatePack';
