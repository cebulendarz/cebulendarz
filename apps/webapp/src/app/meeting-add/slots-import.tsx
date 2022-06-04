import SettingsIcon from '@mui/icons-material/Settings';
import styled from '@emotion/styled';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { MeetingSlot } from '../meeting/meeting';

const StyledSettingsIcon = styled(SettingsIcon)`
  cursor: pointer;

  &:hover {
    color: #b31536;
  }
`;

enum ImportAction {
  Csv,
  Repeatable,
}

export const SlotsImport = ({
  onImport,
}: {
  onImport: (slots: Partial<MeetingSlot>[]) => void;
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const menuSelected = (action?: ImportAction) => {
    setMenuAnchorEl(null);
    if (action != undefined) {
      setDialogAction(action);
    }
  };

  const [dataToImport, setDataToImport] = useState<Partial<MeetingSlot>[]>([]);
  const [dialogAction, setDialogAction] = useState<ImportAction | null>(null);
  const dialogOpen = dialogAction !== null;

  const handleImport = () => {
    onImport(dataToImport);
    setDialogAction(null);
  };

  return (
    <>
      <StyledSettingsIcon
        fontSize="small"
        color="secondary"
        onClick={(event: any) => setMenuAnchorEl(event.currentTarget)}
      />
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={() => menuSelected(undefined)}
      >
        <MenuItem onClick={() => menuSelected(ImportAction.Csv)}>
          Importuj CSV
        </MenuItem>
        <MenuItem
          disabled={true}
          onClick={() => menuSelected(ImportAction.Repeatable)}
        >
          Generuj cykliczne
        </MenuItem>
      </Menu>
      <Dialog open={dialogOpen} onClose={() => setDialogAction(null)}>
        <DialogTitle>Dodaj terminy</DialogTitle>
        <DialogContent>
          {dialogAction === ImportAction.Csv && (
            <div>
              <CsvImportInput
                multiline
                onChange={(event) =>
                  setDataToImport(parseCsv(event.target.value))
                }
                rows={4}
              />
              <CsvImportTip>
                <div>
                  Każda linia zawiera jeden termin w formacie
                  "rok-miesiąc-dzień;godzina od;godzina do".
                </div>
                <div>Przykład: 2022-06-30;10:00;10:30</div>
                <div>
                  Puste i zaczynające się od # linie zostaną zignorowane i nie
                  wpłyną na generowanie terminów.
                </div>
              </CsvImportTip>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImport}>Dodaj terminy</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function parseCsv(value: string): Partial<MeetingSlot>[] {
  const slots: Partial<MeetingSlot>[] = [];
  value
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .forEach((line) => {
      try {
        const [date, timeFrom, timeTo] = line.split(';');
        slots.push({ date, timeFrom, timeTo });
      } catch (error) {
        console.error(`Can't parse CSV line, skipping [line=${line}]`);
      }
    });
  return slots;
}

const CsvImportTip = styled.div`
  margin-top: 6px;
  font-size: 0.7em;
  font-weight: 300;
  font-style: italic;
  color: gray;
`;

const CsvImportInput = styled(TextField)`
  width: 100%;
`;
