import React from 'react';
import {Button, Text, View} from 'react-native';
import RNFetchBlob, {FetchBlobResponse} from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import {unzip} from 'react-native-zip-archive';
import RNExitApp from 'react-native-exit-app';

const UpdateScreen = () => {
  let otaUrl: string = 'https://developbranch.cn/release/example-jsbundle';
  const {config, fs} = RNFetchBlob;
  const mainDir: string = RNFS.MainBundlePath;
  const documentDir: string = fs.dirs.DocumentDir;
  const payloadDir: string = documentDir + '/Payload';
  const symbolsDir: string = documentDir + '/Symbols';

  const [versions, setVersions] = React.useState<any[] | undefined>(undefined);

  const [selectedVersion, setSelectedVersion] = React.useState<any | undefined>(
    undefined,
  );

  const [log, setLog] = React.useState<string>('');

  const [update, setUpdate] = React.useState<boolean>(false);

  async function fetch(url: string, types: string[]): Promise<void> {
    console.log('types', types);
    return new Promise<void>((resolve, reject) => {
      RNFetchBlob.fetch('GET', url, {})
        .then((resp: FetchBlobResponse) => {
          let status = resp.info().status;
          setLog('OTA Server: ' + url + ', Status: ' + status);
          if (status === 200) {
            let json = resp.json();
            if (json.versions) {
              console.log('versions', json.versions);
              setVersions(json.versions);
            }
            resolve();
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  async function replace(): Promise<void> {
    console.log('move into app dir');
    const assetDirs: string[] = [
      payloadDir + '/example.app/assets',
      mainDir + '/assets',
    ];
    const jsbundleDirs: string[] = [
      payloadDir + '/example.app/main.jsbundle',
      mainDir + '/main.jsbundle',
    ];

    let p1: Promise<void>;
    let p2: Promise<void>;
    return new Promise<void>((resolve, reject) => {
      RNFS.exists(assetDirs[1]).then((exist: boolean) => {
        if (exist) {
          console.log('remove file', assetDirs[1]);
          RNFS.unlink(assetDirs[1]).then(() => {
            p1 = move(assetDirs[0], assetDirs[1]);
          });
        } else {
          p1 = move(assetDirs[0], assetDirs[1]);
        }
      });

      RNFS.exists(jsbundleDirs[1]).then((exist: boolean) => {
        if (exist) {
          console.log('remove file', jsbundleDirs[1]);
          RNFS.unlink(jsbundleDirs[1]).then(() => {
            p2 = move(jsbundleDirs[0], jsbundleDirs[1]);
          });
        } else {
          p2 = move(jsbundleDirs[0], jsbundleDirs[1]);
        }
      });

      Promise.all([p1, p2])
        .then(() => {
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  async function move(source: string, dist: string): Promise<void> {
    console.log('move file', source, dist);
    return RNFS.moveFile(source, dist);
  }

  async function clear(): Promise<void> {
    let p1: Promise<void>;
    let p2: Promise<void>;
    return new Promise<void>((resolve, reject) => {
      RNFS.exists(payloadDir).then((exist: boolean) => {
        if (exist) {
          console.log('remove file', payloadDir);
          p1 = RNFS.unlink(payloadDir);
        }
      });
      RNFS.exists(symbolsDir).then((exist: boolean) => {
        if (exist) {
          console.log('remove file', symbolsDir);
          p2 = RNFS.unlink(symbolsDir);
        }
      });

      Promise.all([p1, p2])
        .then(() => {
          setLog('Clear cache');
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  async function download(url: string): Promise<void> {
    console.log('documentDir', documentDir);
    setLog('Download: ' + url);
    return new Promise<void>(resolve => {
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          path: documentDir,
          description: 'downloading file...',
          notification: false,
          useDownloadManager: false,
        },
      };
      config(options)
        .fetch('GET', url)
        .progress((received: number, total: number) => {
          console.log('progress', received / total);
          setLog('Download bytes: ' + received + '/' + total);
        })
        .then(res => {
          console.log('res', res);
          //appendLog("Downloaded");
          if (res.respInfo && res.respInfo.status) {
            var msg = 'HTTP status: ' + res.respInfo.status;
            console.log('msg', msg);
            setLog(msg);
            if (res.respInfo.status === 200) {
              //unzip
              unzip(res.data, documentDir).then(() => {
                fs.unlink(res.data);
                setLog('Unzip file');
                resolve();
              });
            }
          }
        });
    });
  }

  return (
    <>
      <Button
        title="Check for Update"
        onPress={() => {
          setLog('Check for update. Type: release');
          fetch(otaUrl, ['release']);
        }}
      />
      {versions && versions.length > 0 && (
        <View>
          <Text>Choose a version:</Text>
          {versions.map((version: any) => {
            return (
              <Button
                title={version.version}
                onPress={() => {
                  setSelectedVersion(version);
                }}
                key={version.version}
              />
            );
          })}
        </View>
      )}
      {selectedVersion && (
        <View>
          <Text>Version: {selectedVersion.version}</Text>
          <Text>What's new: {selectedVersion.description}</Text>
          <Text>Download URL: {selectedVersion.download_url}</Text>
          <Button
            title="Update"
            onPress={() => {
              //console.log("update", selectedVersion.download_url);
              clear().then(() => {
                download(selectedVersion.download_url).then(() => {
                  replace().then(() => {
                    setLog('Update success');
                    setUpdate(true);
                  });
                });
              });
            }}
          />
        </View>
      )}
      <Text>{log}</Text>
      {update && (
        <View>
          <Button
            title="Exit App"
            onPress={() => {
              RNExitApp.exitApp();
            }}
          />
        </View>
      )}
    </>
  );
};

export default UpdateScreen;
