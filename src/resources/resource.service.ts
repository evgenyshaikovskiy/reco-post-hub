import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { File } from 'buffer';

@Injectable()
export class ResourceService {
  private fileServiceDir = path.join(__dirname, '../../', 'uploads');

  constructor() {
    if (!fs.existsSync(this.fileServiceDir)) {
      fs.mkdirSync(this.fileServiceDir);
    }
  }

  public getFile(fileName: string) {
    const filePath = path.join(this.fileServiceDir, fileName + '.png');
    return fs.createReadStream(filePath);
  }
}
