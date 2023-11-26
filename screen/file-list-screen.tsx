import React from 'react';
import {Text} from 'react-native';
import RNFS from 'react-native-fs';

const FileListScreen = () => {
  const [files, setFiles] = React.useState<string | undefined>('');

  React.useEffect(() => {
    let list: string = '';
    let dirpath: string = RNFS.MainBundlePath;
    list += '\nPath: ' + dirpath + '\n\n';
    RNFS.readDir(dirpath).then((result: RNFS.ReadDirItem[]) => {
      result.forEach((file: RNFS.ReadDirItem) => {
        //console.log('dir: ', file.isDirectory(), 'name: ', file.name, 'size: ', file.size);
        let type: string = file.isDirectory() ? 'd' : 'f';
        list += type + ' ' + file.name + ' (' + file.size + ')\n';
      });
      setFiles(list);
    });
  }, []);

  return (
    <>
      <Text>{files}</Text>
    </>
  );
};

export default FileListScreen;
